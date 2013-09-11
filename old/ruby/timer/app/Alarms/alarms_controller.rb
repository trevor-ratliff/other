require 'rho/rhocontroller'
require 'helpers/browser_helper'

class AlarmsController < Rho::RhoController
  include BrowserHelper

  #GET /Alarms
  def index
    @alarmses = Alarms.find(:all)
    render :back => '/app'
  end

  # GET /Alarms/{1}
  def show
    @alarms = Alarms.find(@params['id'])
    if @alarms
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /Alarms/new
  def new
    @alarms = Alarms.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /Alarms/{1}/edit
  def edit
    @alarms = Alarms.find(@params['id'])
    if @alarms
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /Alarms/create
  def create
    @alarms = Alarms.create(@params['alarms'])
    redirect :action => :index
  end

  # POST /Alarms/{1}/update
  def update
    @alarms = Alarms.find(@params['id'])
    @alarms.update_attributes(@params['alarms']) if @alarms
    redirect :action => :index
  end

  # POST /Alarms/{1}/delete
  def delete
    @alarms = Alarms.find(@params['id'])
    @alarms.destroy if @alarms
    redirect :action => :index  end
end
